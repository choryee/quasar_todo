const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Todo.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/lecturerMain', component: () => import('pages/LecturerMain.vue') },
      { path: '/lecturerCalendar', component: () => import('pages/LecturerCalendar.vue') },
      { path: '/StudentMainCalendar', component: () => import('pages/StudentMainCalendar.vue') },
      { path: '/enrollment', component: () => import('pages/Enrollment.vue') },
      { path: '/payment', component: () => import('pages/Payment.vue') },
      { path: '/main', component: () => import('pages/MainPage.vue') },
      { path: '/admin', component: () => import('pages/Administration.vue') },
      { path: '/joinLecturerForm', component: () => import('pages/JoinLecturerForm.vue') },
      { path: '/qna', component: () => import('pages/QuestionAndAnswer.vue') },
      { path: '/notice', component: () => import('pages/Notice.vue') },
      { path: '/update-info-for-lecturer', component: () => import('pages/UpdateInfoForLecturer.vue') }, // 추가
      { path: '/test', component: () => import('pages/Test.vue') }, // 추가
      { path: '/jobInterviewCalendar', component: () => import('pages/JobInterviewCalendar.vue') }, // 추가
      { path: '/jobCalendarFormLecturer', component: () => import('pages/JobCalendarFormLecturer.vue') }, // 추가
      { path: '/StudentInfo', component: () => import('pages/StudentInfo.vue') }, // 추가
      { path: '/joinStudentForm', component: () => import('pages/JoinStudentForm.vue') }, // 추가
      { path: '/lecturerList', component: () => import('pages/LecturerList.vue') }, // 추가

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
