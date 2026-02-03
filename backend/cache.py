import redis
import json
import requests
from typing import Optional, Any
from datetime import datetime
from config import settings


class DateTimeEncoder(json.JSONEncoder):
    """Custom JSON encoder for datetime objects"""
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


class RedisCache:
    def __init__(self):
        # Check if Upstash REST API is configured
        if settings.UPSTASH_REDIS_REST_URL and settings.UPSTASH_REDIS_REST_TOKEN:
            self.use_upstash_rest = True
            self.upstash_url = settings.UPSTASH_REDIS_REST_URL.rstrip('/')
            self.upstash_token = settings.UPSTASH_REDIS_REST_TOKEN
            self.redis_client = None
        # Check if REDIS_URL is provided (for standard Redis with URL)
        elif settings.REDIS_URL:
            self.use_upstash_rest = False
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True
            )
        # Fallback to host/port configuration
        else:
            self.use_upstash_rest = False
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD if settings.REDIS_PASSWORD else None,
                decode_responses=True
            )
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if self.use_upstash_rest:
                response = requests.get(
                    f"{self.upstash_url}/get/{key}",
                    headers={"Authorization": f"Bearer {self.upstash_token}"}
                )
                if response.status_code == 200:
                    result = response.json().get('result')
                    if result:
                        return json.loads(result)
                return None
            else:
                value = self.redis_client.get(key)
                if value:
                    return json.loads(value)
                return None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None
    
    def set(self, key: str, value: Any, expire: int = 3600) -> bool:
        """Set value in cache with expiration (default 1 hour)"""
        try:
            if self.use_upstash_rest:
                response = requests.post(
                    f"{self.upstash_url}/set/{key}/{json.dumps(value, cls=DateTimeEncoder)}/EX/{expire}",
                    headers={"Authorization": f"Bearer {self.upstash_token}"}
                )
                return response.status_code == 200
            else:
                self.redis_client.setex(
                    key,
                    expire,
                    json.dumps(value, cls=DateTimeEncoder)
                )
                return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            if self.use_upstash_rest:
                response = requests.post(
                    f"{self.upstash_url}/del/{key}",
                    headers={"Authorization": f"Bearer {self.upstash_token}"}
                )
                return response.status_code == 200
            else:
                self.redis_client.delete(key)
                return True
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            if self.use_upstash_rest:
                response = requests.get(
                    f"{self.upstash_url}/exists/{key}",
                    headers={"Authorization": f"Bearer {self.upstash_token}"}
                )
                if response.status_code == 200:
                    return response.json().get('result', 0) > 0
                return False
            else:
                return self.redis_client.exists(key) > 0
        except Exception as e:
            print(f"Redis exists error: {e}")
            return False
    
    def clear_user_cache(self, user_id: int):
        """Clear all cache entries for a user"""
        try:
            if self.use_upstash_rest:
                # Upstash REST API doesn't support KEYS command well
                # For production, consider maintaining a set of keys per user
                print(f"Warning: clear_user_cache not fully supported with Upstash REST API")
                return True
            else:
                pattern = f"user:{user_id}:*"
                keys = self.redis_client.keys(pattern)
                if keys:
                    self.redis_client.delete(*keys)
                return True
        except Exception as e:
            print(f"Redis clear user cache error: {e}")
            return False


# Global cache instance
cache = RedisCache()
