# Create your views here.
import os
from django.shortcuts import render_to_response
from django.template import RequestContext

def index(request):
    #path = os.path.join(os.path.dirname(__file__),'templates\index.html')
    template_name = 'index.html';
    return render_to_response(template_name, {'header_menu_selected': 'index'}, context_instance = RequestContext(request))
    
def forward(request, name):
    template_name = '' + name
    return render_to_response(template_name, {'header_menu_selected': name.split('.')[0]}, context_instance = RequestContext(request))
