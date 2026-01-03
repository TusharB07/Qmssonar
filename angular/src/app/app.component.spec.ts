/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { AppTopbarComponent } from "./components/app-topbar/app.topbar.component";
import { AppFooterComponent } from "./components/app-footer/app.footer.component";
import { AppSideBarComponent } from "./app.sidebar.component";
import { AppSideBarTabContentComponent } from "./app.sidebartabcontent.component";
import { AppMenuComponent } from "./components/app-menu/app.menu.component";

describe("AppComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, AppTopbarComponent, AppMenuComponent, AppFooterComponent, AppSideBarComponent, AppSideBarTabContentComponent]
    });
    TestBed.compileComponents();
  });

  it("should create the app", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
