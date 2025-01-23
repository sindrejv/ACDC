using UnityEngine;

public class WizardController : MonoBehaviour
{
    public float moveSpeed = 5f;
    public GameObject spellPrefab;
    public float spellSpeed = 10f;
    
    private void Update()
    {
        // Movement
        float horizontal = Input.GetAxisRaw("Horizontal");
        float vertical = Input.GetAxisRaw("Vertical");
        
        Vector3 movement = new Vector3(horizontal, vertical, 0f).normalized;
        transform.position += movement * moveSpeed * Time.deltaTime;
        
        // Shooting
        if (Input.GetMouseButtonDown(0))
        {
            Vector3 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Vector2 direction = (mousePosition - transform.position).normalized;
            
            GameObject spell = Instantiate(spellPrefab, transform.position, Quaternion.identity);
            spell.GetComponent<Rigidbody2D>().velocity = direction * spellSpeed;
        }
    }
} 