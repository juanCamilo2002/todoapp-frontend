import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../../modules/auth/services/auth.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    private authService = inject(AuthService);
    private router = inject(Router);

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    // public routes
    private publicRoutes: string[] = ['/auth/login', '/auth/register'];

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isPublic = this.publicRoutes.some(route => req.url.includes(route));

        if (isPublic) {
            // if the route is public, do not add the token
            return next.handle(req);
        }

        const accessToken = this.authService.getAccessToken();
        let authReq = req;

        if (accessToken) {
            authReq = req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                const refreshToken = this.authService.getRefreshToken();

                // si no hay refresh token o no es un 401, no se intenta refrescar el token
                if (error.status !== 401 || !refreshToken || this.authService.isTokenExpired(refreshToken)) {
                    this.authService.logout();
                    this.router.navigate(['/auth/login']);
                    return throwError(() => error);
                }

                // Evita múltiples llamadas simultáneas para refrescar el token
                if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    this.refreshTokenSubject.next(null);

                    return this.authService.refreshToken().pipe(
                        switchMap((tokens) => {
                            this.isRefreshing = false;
                            this.authService.setTokens(tokens.accessToken, tokens.refreshToken);
                            this.refreshTokenSubject.next(tokens.accessToken);

                            const retryReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${tokens.accessToken}` },
                            });

                            return next.handle(retryReq);
                        }),
                        catchError((err) => {
                            this.isRefreshing = false;
                            this.authService.logout();
                            this.router.navigate(['/auth/login']);
                            return throwError(() => err);
                        })
                    );
                } else {
                    // Si ya se está refrescando el token, espera a que se complete
                    return this.refreshTokenSubject.pipe(
                        filter(token => token != null),
                        take(1),
                        switchMap((token) => {
                            const retryReq = req.clone({
                                setHeaders: { Authorization: `Bearer ${token}` },
                            });
                            return next.handle(retryReq);
                        })
                    );
                }
            })
        );
    }
}

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const authInterceptor = inject(AuthInterceptor);
    return authInterceptor.intercept(req, { handle: next });
}