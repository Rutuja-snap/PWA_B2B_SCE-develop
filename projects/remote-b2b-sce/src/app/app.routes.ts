import { Routes } from '@angular/router';

// Provided by `provideRouter` in `app.config.ts` file
export const appRoutes: Routes = [
  {
    path: 'b2b-sce',
    loadChildren: () => import(`../app/aapod/b2b-sce.module`).then((m) => m.B2bSceModule)
  },
];