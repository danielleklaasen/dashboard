# Bike Repair Dashboard

A dashboard web application that works together with the Bike Repair app and allows you to manage incoming reports.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live server.

### Gulp

Use it to make your life easier :)

#### Watchers

Run the command below to open the project in your browser. When you change a file, gulp will compile your styles and the browser will automatically refresh. 

```
gulp watch
```

#### BrowserSync

After running gulp watch you'll get a URL in the terminal, use it to open to your project from different browsers / devices. The screens will all be synchronised. 

#### Deployment

Make sure you run this command to clean up your /dist folder, minify JS and HTML and optimise your images.

```
gulp build
``` 
You are now ready to upload the files to a server.

### Directory Structure

All your working files (images, scripts, styles) go in the /assets folder. When you use Gulp all your optimised files will come in the /dist folder. Refer to this one in your code.


## Built With

* [Gulp](https://gulpjs.com/) - Workflow enhancement tool
* [NPM](https://www.npmjs.com/) - Package Manager

## Authors

* **Danielle Klaasen** - *Initial work* - [danielleklaasen.com](http://www.danielleklaasen.com)

See also the list of [contributors](https://github.com/danielleklaasen/dashboard/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Info.nl, thanks for letting us use the Innovation Lab!

