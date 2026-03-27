<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('register', 'AuthController::register');
$routes->post('login', 'AuthController::login');
$routes->get('protected', 'Home::index', ['filter' => 'auth']);
$routes->get('users', 'AuthController::getUsers', ['filter' => 'auth']);
$routes->get('teachers', 'AuthController::getTeachers', ['filter' => 'auth']);
