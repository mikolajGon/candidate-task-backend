<?php

namespace App\Domain\Guide;

class ArrayOfGuideSteps extends \ArrayObject
{
    public function offsetSet($key, $value)
    {
        if ($value instanceof GuideStep) {
            parent::offsetSet($key, $value);
            return;
        }
        throw new \InvalidArgumentException('Value must be a GuideStep');
    }
}
