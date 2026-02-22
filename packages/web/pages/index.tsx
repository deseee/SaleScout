export default function Home() {
  return (
    <main style={{ padding: 40, maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to SaleScout</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        The smarter way to discover and host estate sales in Grand Rapids
      </p>
      
      <div style={{ 
        backgroundColor: '#f0f9ff', 
        padding: '2rem', 
        borderRadius: '8px', 
        marginBottom: '2rem' 
      }}>
        <h2 style={{ marginTop: 0 }}>🎉 Grand Rapids Organizers: Join Our Beta!</h2>
        <p>
          Be among the first 50 organizers to join SaleScout and enjoy:
        </p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li><strong>Zero commission for 6 months</strong></li>
          <li>Premium placement in local search results</li>
          <li>Free QR codes for all your items</li>
          <li>Personalized support from our local team</li>
          <li>Early access to our route planning tools</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          <a 
            href="mailto:organizers@salescout.app?subject=Grand Rapids Organizer Beta" 
            style={{ 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Claim Your Spot
          </a>
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '1.5rem' 
        }}>
          <h3>🔍 For Shoppers</h3>
          <p>Discover estate sales near you with our powerful search and filtering tools.</p>
          <a href="/route-planner">Plan Your Route →</a>
        </div>
        
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px', 
          padding: '1.5rem' 
        }}>
          <h3>💼 For Organizers</h3>
          <p>List your sales and reach more buyers with our optimized platform.</p>
          <a 
            href="mailto:organizers@salescout.app?subject=Organizer Inquiry" 
            style={{ textDecoration: 'none' }}
          >
            Learn More →
          </a>
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        backgroundColor: '#fffbeb', 
        borderRadius: '8px' 
      }}>
        <h3>Why Choose SaleScout Over estatesales.net?</h3>
        <p style={{ marginBottom: '1rem' }}>
          <strong>We're 100% focused on Grand Rapids</strong> - while they're nationwide, 
          we put local organizers first.
        </p>
        <ul style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          listStyle: 'none', 
          padding: 0 
        }}>
          <li style={{ margin: '0 1rem' }}>📍 Local SEO Advantage</li>
          <li style={{ margin: '0 1rem' }}>⚡ Faster Sales</li>
          <li style={{ margin: '0 1rem' }}>🤝 Personal Support</li>
        </ul>
      </div>
    </main>
  );
}
