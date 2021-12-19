from django.urls import path

from .views import FileView, DirView, UserView

urlpatterns = [
    path('file', FileView.as_view()),
    path('dir', DirView.as_view()),
    path('user', UserView.as_view())
]