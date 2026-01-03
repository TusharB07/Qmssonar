import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from './features/account/account.service';
import { AllowedRoles, IRole } from './features/admin/role/role.model';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivateChild {
    constructor(private accountService: AccountService, private router: Router) { }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.accountService.currentUser$.pipe(
            map(auth => {
                // console.log(auth)
                const role: IRole = auth.roleId as IRole;
                const allowed_roles: any[] = route.data.allowed_roles;

                if (allowed_roles?.includes(role.name) ?? true) return true;

                // // console.log(route.data.allowed_roles)
                this.router.navigate(['/access-denied']);
                return false;
                // if (auth) {
                    // return true;
                // } else {
                // this.router.navigate(["account/login"], {
                //     queryParams: { returnUrl: state.url }
                // });

                //     return false;
                // }
            })
        );
    }

}

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {
    constructor(private accountService: AccountService, private router: Router) { }

    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.accountService.currentUser$.pipe(
            map(auth => {
                const role: IRole = auth.roleId as IRole;

                if ([AllowedRoles.ADMIN,
                AllowedRoles.AGENT_ADMIN,
                AllowedRoles.BANCA_ADMIN,
                AllowedRoles.BROKER_ADMIN,
                AllowedRoles.INSURER_ADMIN].includes(role.name)) return true;

                this.router.navigate(['/access-denied']);
                return false;
            })
        );
    }

}
