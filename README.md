Tetris
======

### Tetris in HTML5 & Canvas

------

### Todo
- draw the next piece
- draw the ghost piece where it would end up
- draw game over on board
- spacebar key event for dropping the piece all the way to the bottom
- movement key events fo h,j,k,l 
- add on screen controls for movements with just a mouse
- store sound setting in a cookie so that you don't have to press pause each time

### Completed
- basic code struture
- game loop
- shape object
- keyboard events
- if block goes off screen then make it show up on the other side
- support for chaning block color
- added random starting position
- collision detection for x, y on active square
- collision detection for edges
- refactored Shape for blocks
- added page layout and css styles
- create shapes: square, line, t, s, and z
- add logic and events layer
- add logic to prevent blocks from going off to the right or left
- add logic to prevent movement on collision with another block
- added 3d effect for blocks
- fix the rotate logic
- line completion logic
- ability to remove blocks on line completion
- add scoring and page callbacks
- fix bug with line completion which removes wrong pieces
- fix rotate logic which makes the piece go off screen
- add logic to determine if you have lost the game
- sounds: theme music, game over, row completion, level up
- add screen controls indicating current level
- add levels which increase speed
