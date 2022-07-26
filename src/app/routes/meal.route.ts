import { AuthGuard } from '../auth.guard';

export const MealRoute = {
    path: 'meal', loadChildren: () => import('src/modules/meal/meal.module').then(mod => mod.MealModule),
    canActivate: [AuthGuard],
    data: {
      title: '智慧点餐',
      icon: "project",
      nzOpen: true,
      subRoutes:
        [
          { pageUrl: 'meal-dashboard', title:'智慧点餐', icon:'project' },
        ]
    }
  }
