using UnityEngine;

public class Spell : MonoBehaviour
{
    public float lifetime = 2f;
    
    private void Start()
    {
        Destroy(gameObject, lifetime);
    }
    
    private void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Enemy"))
        {
            Destroy(collision.gameObject);
            Destroy(gameObject);
        }
    }
} 