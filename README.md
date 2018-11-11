### Introduction

An assignment task to create an editable table with some simple server-side CRUD. 
Task description is in "Consumer Manager (Laravel & Vue.js).pdf" 

### Setup

This solution uses Laravel 5.7.13, so you need to setup your system to support that version. At minimum, you need PHP >= 7.1.3
Also, you need enabled the php module for support of sqlite db, as well as npm installed.


To run the solution, do the setup bellow and then just use the php artisan self-hosted local server

```bash
cd top_videos_summary
npm install
composer install
npm run dev
php artisan migrate
php artisan serve
```

The url to get to the consumers manager is

> http://127.0.0.1:8000/consumers

You might want to seed the database, so you can see some users in the table (or you can create them manually too)

```bash
php artisan db:seed

```

To run the solution, you also need to create in the root of the project an .env file
