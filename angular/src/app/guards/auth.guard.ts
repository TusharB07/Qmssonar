import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AccountService } from "./../features/account/account.service";
import { AllowedRoles, IRole } from "../features/admin/role/role.model";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        if (auth) {
          return true;
        } else {
          this.router.navigate(["account/login"], {
            queryParams: { returnUrl: state.url }
          });

          return false;
        }
      })
    );
  }
}

@Injectable({
  providedIn: "root"
})
export class QuoteCreateGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        const role: IRole = auth.roleId as IRole;

        const allowed_roles: any[] = route.data.allowed_roles;

        if ([AllowedRoles.BROKER_CREATOR,
        AllowedRoles.BROKER_CREATOR_AND_APPROVER,
        AllowedRoles.AGENT_CREATOR,
        AllowedRoles.AGENT_CREATOR_AND_APPROVER,
        AllowedRoles.BANCA_CREATOR,
        AllowedRoles.BANCA_CREATOR_AND_APPROVER,
        AllowedRoles.SALES_CREATOR,
        AllowedRoles.SALES_CREATOR_AND_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR,
        AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(role.name)) return true;

        this.router.navigate(['/access-denied']);
        return false;
      })
    );
  }
}

@Injectable({
  providedIn: "root"
})
export class QuoteRequisitionReviewGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        const role: IRole = auth.roleId as IRole;

        const allowed_roles: any[] = route.data.allowed_roles;

        if ([AllowedRoles.BROKER_APPROVER,
        AllowedRoles.BROKER_CREATOR,
        AllowedRoles.BROKER_CREATOR_AND_APPROVER,
        AllowedRoles.BANCA_APPROVER,
        AllowedRoles.BANCA_CREATOR_AND_APPROVER,
        AllowedRoles.AGENT_CREATOR_AND_APPROVER,
        AllowedRoles.SALES_CREATOR,
        AllowedRoles.SALES_APPROVER,
        AllowedRoles.SALES_CREATOR_AND_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR,
        AllowedRoles.PLACEMENT_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(role.name)) return true;

        this.router.navigate(['/access-denied']);
        return false;
      })
    );
  }
}


@Injectable({
  providedIn: "root"
})
export class InsurerGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        const role: IRole = auth.roleId as IRole;

        const allowed_roles: any[] = route.data.allowed_roles;

        if ([AllowedRoles.INSURER_RM,
        AllowedRoles.BROKER_CREATOR_AND_APPROVER,
        AllowedRoles.SALES_CREATOR_AND_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        AllowedRoles.INSURER_UNDERWRITER,
        AllowedRoles.INSURER_ADMIN,
        AllowedRoles.PLACEMENT_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR
        ].includes(role.name)) return true;

        this.router.navigate(['/access-denied']);
        return false;
      })
    );
  }
}

@Injectable({
  providedIn: "root"
})
export class QCRGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.accountService.currentUser$.pipe(
      map(auth => {
        const role: IRole = auth.roleId as IRole;

        const allowed_roles: any[] = route.data.allowed_roles;

        if ([AllowedRoles.BROKER_APPROVER,
        AllowedRoles.BROKER_CREATOR_AND_APPROVER,
        AllowedRoles.BANCA_APPROVER,
        AllowedRoles.BANCA_CREATOR_AND_APPROVER,
        AllowedRoles.AGENT_CREATOR_AND_APPROVER,
        AllowedRoles.SALES_APPROVER,
        AllowedRoles.SALES_CREATOR_AND_APPROVER,
        AllowedRoles.PLACEMENT_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        AllowedRoles.PLACEMENT_CREATOR

        ].includes(role.name)) return true;

        this.router.navigate(['/access-denied']);
        return false;
      })
    );
  }
}
