from django.conf.urls.defaults import patterns, include, url

handler500 = 'djangotoolbox.errorviews.server_error'

urlpatterns = patterns('main.views',
    #('^_ah/warmup$', 'djangoappengine.views.warmup'),
    #url(r'^rjweb/', include('main.urls')),
    url(r'^$','index'),
    url(r'^(?P<name>\w+.html)', 'forward'),
)
