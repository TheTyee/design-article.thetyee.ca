# design-article.thetyee.ca
Working in the open on The Tyee's new article page design

## Installation

1. Get the source / sub-modules

`git clone git@github.com:TheTyee/design-article.thetyee.ca.git`

`git submodule init && git submodule update`

2. Install the JavaScript dependencies

`bower install`

3. Install the Ruby dependencies

If you don't have a global install of [Bundler](http://bundler.io/), you'll want to install that first:

`gem update && gem install bundler`

Then install the project requirements in local directory so that you know you're using the right ones:

`bundle install --path _vendor`

## Bundler, Jekyll & development modes

If you run Jekyll though Bundler the project can the gems installed in the `_vendor` directory:

`bundle exec jekyll serve -w --config _config.yml`

That helps to ensure the project is using the right version of each gem, and that it's easily deployed. If you need to add more Ruby dependencies, add them to the `gemfile` and then run `bundle install --path _vendor`.

Configuration files can be added to switch modes:

`bundle exec jekyll serve -w --config _config.yml,_config.development.yml`

## If you're not using Bundler

If not using Bundler, you can simply pass the configuration arguments directly to Jekyll like so:

`jekyll serve -w --config _config.yml,_config.development.yml`

`jekyll serve -w --config _config.yml,_config.development.yml`

## Notes on HTML structure

The layout file for the article page is at **_layouts/article.html** (This page then gets rendered in the index.html page file).

Inside of article.html, you'll find a series of includes created to reflect this mockup: https://basecamp.com/1929296/projects/9481270/messages/48980865?enlarge=185388269#attachment_185388269

All includes can be found in the **_includes folder**.

There are no classes appended to any of the sections, except where some bootstrap styling was needed. This is so @AlexGreen can feel free to add any classes he likes without worrying about breaking anything I've done.

The list of includes is:
* Ad Box
* Content (This is a block of content that mimics the current style of a tyee story, where the HTML is added and rendered to the page as one large block: http://thetyee.ca/News/2015/12/01/Pam-Goldsmith-Jones-Interview/).
* Paragraph (A single paragraph of content that can be combined with other page elements to create a more complex page layout, like with a Tyee Series: http://thetyee.ca/News/2015/10/12/Ottawa-Created-Housing-Agency/)
* Featured, standard and wide image includes
* Story masthead, which includes the HED, DEK, Authour, Authour Bio, Authour Image and sharing tools.
* Pullquote
* Photo gallery, which is a slide show, meant for photo essays.
* Multimedia, meant for video or audio content that would likely be an iframe embed
* Sidebar, which is the containing element for all sidebar content
* Related stories
* Ask (Builder request)
* Subscribe (Newsletter subscribe)
* Share (Sharing tools)

The general idea is that each of these elements can be used in multiple positions on the page.

### Additional
You will notice that some of the includes are being populated with Jekyll (Jekyll tags are identifiable from their `{% %}` or `{{}}` wrappers). This is meant to replicate the behaviour or any CMS, and hopefully make it easier to account for dynamic content when styling. This data is being pulled from a csv I made out of existing Tyee stories.

If at any point, you'd like to sub in new content to see how the styles hold up, you can do that by searching out all `{% for field in site.data.example_stories limit:1 %}` tags and setting them to `{% for field in site.data.example_stories limit:2 %}` or `{% for field in site.data.example_stories limit:3 %}`. You can also feel free to reorder any of the includes in article.html and sidebar.html.






