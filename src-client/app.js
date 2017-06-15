import 'babel-polyfill';
import $ from 'jquery';

import helloWorld from './hello-world';

$(`<h1>${helloWorld}</h1>`).appendTo('body');
