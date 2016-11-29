   //Variables
var $saveButton = $('.save-button');
var $titleInput = $('.title-input');
var $bodyInput = $('.body-input');
var $ideaList = $('.idea-list');
var $searchInput = $('.search-input');


// Constructor for a new Idea
function Idea (title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = id || Date.now();
  this.quality = quality || 's«will';
}

function clearInputFields () {
	$titleInput.val("");
	$bodyInput.val("");
}

//Object for ideas
var Ideas = {
	allIdeas: [],

	add: function (title, body) {
		this.allIdeas.unshift(new Idea(title, body));
		this.store();
	},

	store: function () {
		localStorage.setItem('allIdeas', JSON.stringify(this.allIdeas));
	},

	retrieve: function () {
		var ideasFromStorage = localStorage.getItem('allIdeas') || '[]';
		var ideasAsObjects = JSON.parse(ideasFromStorage);
		this.allIdeas = ideasAsObjects.map(function(obj) {
			return new Idea(obj.title, obj.body, obj.id, obj.quality);
		});
	},

  render: function () {
    $ideaList.html('');
    this.allIdeas.forEach( function (idea) {
      $ideaList.append(
        '<article class="idea-card" data-id=' + idea.id + '>' +
          '<h2 class="idea-title" contenteditable="true">' + idea.title + '</h2>' +
          '<button class="image delete-button"></button>' +
          '<p class="idea-body" contenteditable="true">' +
            idea.body +
          '</p>' +
          '<div class="quality-container">' +
            '<button class="image upvote-button"></button>' +
            '<button class="image downvote-button"></button>' +
            '<aside class="current-quality"><span>quality: </span>' +
              idea.quality +
            '</aside>' +
          '</div>' +
        '</article>'
      );
    });
  },

  findIdea: function(id) {
    id = parseInt(id);
    return this.allIdeas.find(function(idea) {
      return idea.id === id;
    });
  },

  levelUp: function(id) {
    id = parseInt(id);
    var foundIdea = Ideas.findIdea(id);
    if (foundIdea.quality === 'plausible') {
      foundIdea.quality = 'genius';
    }
    if (foundIdea.quality === 'swill') {
      foundIdea.quality = 'plausible';
    }
    this.store();
  },

  levelDown: function(id) {
    id = parseInt(id);
    var foundIdea = Ideas.findIdea(id);
    if (foundIdea.quality === 'plausible') {
      foundIdea.quality = 'swill';
    }
    if (foundIdea.quality === 'genius') {
      foundIdea.quality = 'plausible';
    }
    this.store();
  },

  titleEdit: function(id, newTitle) {
    id = parseInt(id);
    var idea = this.findIdea(id);
    idea.title = newTitle;
    this.store();
  },

  bodyEdit: function(id, newBody) {
    id = parseInt(id);
    var idea = this.findIdea(id);
    idea.body = newBody;
    this.store();
  },

	remove: function(id) {
		this.allIdeas = this.allIdeas.filter(function(idea) {
		  return idea.id !== id;
		});
		this.store();
	}
};

//Have save button pull inputs
$saveButton.on('click', function() {
	Ideas.add($titleInput.val(), $bodyInput.val());
	Ideas.render();
	clearInputFields();
});

//Delete button functionality
$ideaList.on('click', '.delete-button', function() {
	var id = $(this).parent().data('id');
	Ideas.remove(id);
	Ideas.render();
});


//LevelUp button functionality
$ideaList.on('click', '.upvote-button', function() {
  var id = $(this).parent().parent().data('id');
  Ideas.levelUp(id);
  Ideas.render();
});

$ideaList.on('click', '.downvote-button', function() {
  var id = $(this).parent().parent().data('id');
  Ideas.levelDown(id);
  Ideas.render();
});

//Have search input filter results
$searchInput.on('keyup', function() {
  var filter = $(this).val();
  $('.idea-card').each(function() {
   if($(this).text().search(new RegExp(filter, 'i')) < 0) {
     $(this).fadeOut();
   }
   else {
     $(this).fadeIn();
   }
  });
});

$ideaList.on('focusout', '.idea-title', function() {
  var id = $(this).parent().data('id');
  var newTitle = $(this).text();
  Ideas.titleEdit(id, newTitle);
});

$ideaList.on('focusout', '.idea-body', function() {
  var id = $(this).parent().data('id');
  var newBody = $(this).text();
  Ideas.bodyEdit(id, newBody);
});

$(document).ready(function(){

	Ideas.retrieve();
	Ideas.render();

});
