# Generating images from source json using GraphicsMagick


## Installation

* Install brew: http://brew.sh/
* brew install graphicsmagick
* brew install ghostscript - (For handling fonts)

## Execution

* npm install or sudo npm install
* node app.js

## Configuration

* app-config.json - Will consists of different types and quality of the image to generate. We can override the image quality per each type.
```
{
  "types": {
    "clips": {
      "SD": {
        "quality": "50",
        "height": "500",
        "width": "500"
      },
      "HD": {
        "height": "800",
        "width": "800"
      }
    }
  },
  "quality": {
    "SD": "75",
    "HD": "100"
  }
}
```
* source.json - Source file to read image, title & description to process
```
[
  {
    "title": "TheCarmichaelShow",
    "description": "Description goes here... ",
    "image": "http://www.nbc.com/sites/nbcunbc/files/files/styles/nbc_homepage_dynamic_slide_image/public/images/2015/8/11/2015-0812-FoodFighters-1920x1080-TVE-SB.jpg?itok=1VaoCu7y"
  }
]
```