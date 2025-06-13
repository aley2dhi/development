from django.shortcuts import render

def home(request):

    return render(request, 'rufaga_annoor_app/home.html')

def index(request):

    return render(request, 'rufaga_annoor_app/index.html')

