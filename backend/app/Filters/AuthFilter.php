<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    private $key = "teju_super_secure_jwt_secret_key_2026_very_long";

    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine("Authorization");

        if (!$header) {
            return service('response')->setJSON([
                'message' => 'Token required'
            ])->setStatusCode(401);
        }

        try {
            $token = explode(" ", $header)[1];
            JWT::decode($token, new Key($this->key, 'HS256'));
        } catch (\Exception $e) {
            return service('response')->setJSON([
                'message' => 'Invalid token'
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}