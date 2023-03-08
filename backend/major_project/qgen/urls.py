from django.urls import path
from .views import GeneratePDF

app_name = "qgen"

urlpatterns = [
    path("", GeneratePDF.as_view(), name="genpdf")
]
