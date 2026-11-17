<?php
// Laravel API Route definitions
return [
    'GET /api/v1/status' => function() {
        return ['status' => 'operational', 'timestamp' => time()];
    }
];
