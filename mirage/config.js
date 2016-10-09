export default function() {

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `api`, for example, if your API is namespaced
  this.timing = 600;      // delay for each request, automatically set to 0 during testing

  this.get  ('/projects');
  this.post ('/projects');
  this.get  ('/projects/:id');
  this.patch('/projects/:id');

  this.get  ('/scenes');
  this.post ('/scenes');
  this.get  ('/scenes/:id');
  this.patch('/scenes/:id');

  this.get  ('/actors');
  this.post ('/actors');
  this.get  ('/actors/:id');
  this.patch('/actors/:id');
  this.delete('/actors/:id');

  this.get  ('/classes');
  this.get  ('/classes/:id');
  this.patch('/classes/:id');

  this.get('/backgrounds');
  this.get('/backgrounds/:id');
}
