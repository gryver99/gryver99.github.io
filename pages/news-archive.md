---
layout: default
title: News Archive
permalink: /news-archive/
---

<section class="archive-page">
  <div class="archive-page__inner">
    <h1>News Archive</h1>
    <p>Browse all published updates by year and month.</p>

    <div class="archive-page__quicklinks">
      <a href="{{ '/categories/' | relative_url }}">Categories</a>
      <a href="{{ '/tags/' | relative_url }}">Tags</a>
      <a href="{{ '/search/' | relative_url }}">Search</a>
    </div>

    {% assign years = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
    {% for year in years %}
      <section class="archive-year">
        <h2>{{ year.name }} <span>({{ year.items.size }})</span></h2>
        {% assign months = year.items | group_by_exp: "post", "post.date | date: '%B'" %}
        {% for month in months %}
          <article class="archive-month">
            <h3>{{ month.name }} <span>({{ month.items.size }})</span></h3>
            <ul>
              {% assign month_posts = month.items | sort: "date" | reverse %}
              {% for post in month_posts %}
                <li>
                  <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                  <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
                </li>
              {% endfor %}
            </ul>
          </article>
        {% endfor %}
      </section>
    {% endfor %}
  </div>
</section>
