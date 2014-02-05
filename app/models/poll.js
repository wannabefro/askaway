App.Poll = DS.Model.extend({
  question: DS.attr(),
  choices: DS.hasMany('choice', {embedded: 'always'})
});
