# Maido: moddable, self-hosted todo list.

This is a simple todolist which runs off html and javascript. No docker, node.js or any of that fluff required. Just click index.html and run :)

## Core principles
You know how web kanban boards come with many features like priorities, completion percentage, and so on that you probably don't want in your face all the time?

Maido doesn't do that. But it can and will support them, if you want! 

Maido aims to be as simple but extensible as possible. The base is loaded with features but there is an addin api from which you can develop your own addins as you desire.

Each task only has 4 things: a name, tags (metadata), a date and a description. Aside from that, it's up to you, the user, to manage what task properties you want.

## Core features
See the documentation in Maido for more details.

## Addons 
### Compain
A little companion designed to provide you with information from the corner of your eye. It's small and ideal for keeping pinned to the top of your screen.
### Tag formatting manager
Provides formatting for tags e.g. #deadline will format your input in red. As expected, it is quite user-customisable.
### Notify
Uses notifications to notify you of task starts.
### Template
Adds a dialog for inserting template text into the description boxes.
### Timeline (not currently maintained, may be broken)
Creates a timeline for visualising your tasks.
### Qrosstalk (not currently maintained, definitely broken)
Uses [Qrosstalk](https://github.com/acenturyandabit/qrosstalk) to send the tasklist between devices with a camera.
## TODO
An add on system which allows loading and unloading add ons.

If you want to contribute, submit a pull request! If you want features or whatnot and you want them *pronto*, email me: steeven.liu2@gmail.com

Enjoy :D
