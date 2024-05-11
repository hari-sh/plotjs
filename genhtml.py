import numpy as np
import matplotlib.pyplot as plt
import json

def makedatum(xarr,yarr,name):
    valarr = []
    for xval, yval in zip(xarr, yarr):
        valarr.append({'x':xval, 'y':yval})
    return {
        'name':name,
        'val':valarr
    }

t = np.arange(-1, 1, 0.001)
y1 = np.cos(2*np.pi*t)
y2 = np.sin(2*np.pi*t)

jsondata = []
jsondata.append(makedatum(t,y1, 'data 1'))
jsondata.append(makedatum(t,y2, 'data 2'))

htmltop = '''<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <script src="https://d3js.org/d3.v3.min.js"></script>
        <script>
const data ='''

htmlbottom = ''' </script>
        <script src="plt.js"></script>
    </body>
</html>'''

with open('sincos.html', 'w') as op:
    op.write(htmltop)
    op.write(json.dumps(jsondata, indent=2))
    op.write(htmlbottom)

plt.plot(t, y1, color='green')
plt.plot(t, y2, color='red')
plt.show()