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
