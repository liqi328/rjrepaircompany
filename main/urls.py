from django.conf.urls.defaults import patterns, include, url


urlpatterns = patterns('main.views',
    url(r'^$','index'),
    #url(r'^contact_save$', 'contact_save'),
    url(r'^(?P<name>\w+.html)', 'forward'),
    #url(r'^project/(?P<name>\w+.html)', 'project_list'),
    #url(r'^achievements/(?P<name>\w+.html)', 'achievement_list'),
    #url(r'^download/(?P<name>\w+.html)', 'download_list'),
    #url(r'^(?P<name>\w+.html$)','forward'),
    #url(r'^(?P<dir>\w+)/(?P<name>\w+.html$)', 'forward'),
)
