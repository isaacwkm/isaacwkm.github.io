---
title:  "A Look at Machinations for Game Systems"
layout: post
categories: systemsDesign
---

![Epic Seven Machination Diagram](https://isaacwkm.github.io/assets/images/epicSevenMachinationThumbnail.png)


*Gacha / JRPG genres often employ a random stat distribution to player equipment as they enhance them. Diagrams help visualize how likely a player will achieve their gear-related goals in their playtime.*

## Machinations

I stumbled across [Machinations.io](https://machinations.io/) recently while I was looking up ways to visualize game systems for systems designers. It's a neat tool.

In this post I'll be exploring how I used it to visualize a mechanic in a gacha game I enjoy playing, *Epic Seven*.

## The Gear Enhancement Mechanic

Gacha / JRPG genres often employ a random stat distribution to player equipment as they enhance them. Diagrams help visualize how likely a player will achieve their gear-related goals in their playtime.

## Code

Embed code by putting `{{ "{% highlight language " }}%}` `{{ "{% endhighlight " }}%}` blocks around it. Adding the parameter `linenos` will show source lines besides the code.

{% highlight c %}

static void asyncEnabled(Dict* args, void* vAdmin, String* txid, struct Allocator* requestAlloc)
{
    struct Admin* admin = Identity_check((struct Admin*) vAdmin);
    int64_t enabled = admin->asyncEnabled;
    Dict d = Dict_CONST(String_CONST("asyncEnabled"), Int_OBJ(enabled), NULL);
    Admin_sendMessage(&d, txid, admin);
}

{% endhighlight %}

## Gists

With the `jekyll-gist` plugin, which is preinstalled on Github Pages, you can embed gists simply by using the `gist` command:

<script src="https://gist.github.com/5555251.js?file=gist.md"></script>

## Images

Upload an image to the *assets* folder and embed it with `![title](/assets/name.jpg))`. Keep in mind that the path needs to be adjusted if Jekyll is run inside a subfolder.

A wrapper `div` with the class `large` can be used to increase the width of an image or iframe.

![Epic Seven and Genshin Impact example](https://isaacwkm.github.io/assets/images/epicSevenGenshinComparison.png)

[Flower](https://unsplash.com/photos/iGrsa9rL11o) by Tj Holowaychuk

## Embedded content

You can also embed a lot of stuff, for example from YouTube, using the `embed.html` include.

{% include embed.html url="https://my.machinations.io/d/epic-seven-pentaroll-simulation/89bd9ec8bcfa11efa81906fdf218a24f" %}