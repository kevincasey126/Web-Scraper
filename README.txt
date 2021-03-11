For the web results I was able to use a fetch request to get the full page
of results from Google. Once I had that HTML, I also found how to call the
next and previous pages which is why I added in that simple pagination. This
part of the task went without a hitch, but I came across a few issues when
doing the image search. When I used a fetch call to get the Google images
search results, I was getting a page that requested I wait for the page to 
finish loading which caused the issue of not being able to get the actual
images. After a few tries I found a solution in opening a second hidden
window, load the url and then take the DOM tree and return it to the renderer.
This had to be done using an IPC communication between the main index class
and the renderer using a synchronous message and return. For the scraping I
found a specific attribute only the images had and queried by that "jsname",
but I also came across the issue of having some images not loaded in. To 
resolve that, I check the objects third child, which should have contained 
the necessary SRC to load in the image. Once that is verified, I can add
the original element into my result container. If you have any questions on 
my code, just let me know and thanks for help along the way. 