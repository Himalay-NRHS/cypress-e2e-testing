describe('home page', () => {
  beforeEach(() => {
    cy.visit('/');
  })
  it('home page loads correctly', () => {
    cy.contains('Welcome to ShopNext');
    cy.get('input[placeholder="Search products..."]').should('be.visible');
    cy.get('button').contains('Search').should('be.visible');
  })

  it('login page routing works', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Welcome Back');
  })
  it('register page routing works', () => {
    cy.contains('Sign Up').click();
    cy.url().should('include', '/signup');
    cy.contains('Create Account');
  })
  it('product page routing works', () => {
    cy.get('[data-testid="product-card"]').first().click();
    cy.url().should('include', '/product/');
    cy.contains('Add to Cart');
  })
  it('search works as intended', () => {
    cy.get('input[placeholder="Search products..."]').type('Laptop');
    cy.get('button').contains('Search').click(); 
  }) 
    
})
describe('login Page',()=>{

  beforeEach(()=>{
    cy.visit("/login");
  })
  
  it('valid credentials should login successfully',()=>{
    cy.get('input[name="email"]').type("test@test.com")
    cy.get('input[name="password"]').type("test1234")
    cy.get('button[type="submit"]').click();
  })

  it('invalid credentials should show error',()=>{
    cy.get('input[name="email"]').type("invalid@test.com")
    cy.get('input[name="password"]').type("wrongpassword")
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password');
  })
 
  
  
  
  it("should navigate to signup page when clicking on Sign Up link",()=>{
    cy.contains('Sign Up').click();
    cy.url().should('include', '/signup');
    cy.contains('Create Account');
  })

})


describe('signup Page',()=>{

  beforeEach(()=>{
    cy.visit("/signup");
  })

  it("should register a new user successfully",()=>{
    const randomEmail = `test${Date.now()}@test.com`;
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type(randomEmail)
    cy.get('input[name="password"]').type("test1234")
    cy.get('input[name="confirmPassword"]').type("test1234")
    cy.get('button[type="submit"]').click();
    
    cy.request('DELETE', `/api/test-user?email=${randomEmail}`);
  })

  it("should show error for already registered email",()=>{
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type("test@test.com")
    cy.get('input[name="password"]').type("test1234")
    cy.get('input[name="confirmPassword"]').type("test1234")

    cy.get('button[type="submit"]').click();
    cy.contains('Email already registered');
  })
  it("should navigate to login page when clicking on Login link",()=>{
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Welcome Back');
  })
  it("should show password mismatch error",()=>{
    const randomEmail = `test${Date.now()}@test.com`;
    cy.get('input[name="name"]').type("Test User")
    cy.get('input[name="email"]').type(randomEmail)
    cy.get('input[name="password"]').type("test1234")
    cy.get('input[name="confirmPassword"]').type("differentpassword")
    cy.get('button[type="submit"]').click();
    cy.contains('Passwords do not match');
  })

})
describe.only('add to cart functionality', () => {
  const testEmail = 'test@test.com';
  const testPassword = 'test1234';

  
  const loginViaApi = () => {
    cy.request('POST', '/api/auth/login', { email: testEmail, password: testPassword }).then(
      ({ body }) => {
        expect(body.success).to.be.true;
        const { token, user } = body.data;
        cy.visit('/');
        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
          win.localStorage.setItem('user', JSON.stringify(user));
        });
      },
    );
  };

  beforeEach(() => {
    loginViaApi();
  });

  it('adds a product to cart from product page', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.contains('Add to Cart').click();
    });

    cy.visit('/cart');
    cy.contains('Shopping Cart');
    cy.get('[data-testid="cart-item"]').should('have.length.greaterThan', 0);
  });

  

   

  it('removes item from cart', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.contains('Add to Cart').click();
    });

    cy.visit('/cart');
    cy.get('[data-testid="cart-item"]', { timeout: 10000 }).first().within(() => {
      cy.get('[data-testid="cart-remove"]').click();
    });
    cy.contains('Your cart is empty');
  });
});

describe.only('checkout functionality', () => {
  const testEmail = 'test@test.com';
  const testPassword = 'test1234';

  const loginViaApi = () => {
    cy.request('POST', '/api/auth/login', { email: testEmail, password: testPassword }).then(
      ({ body }) => {
        expect(body.success).to.be.true;
        const { token, user } = body.data;
        cy.visit('/');
        cy.window().then((win) => {
          win.localStorage.setItem('token', token);
          win.localStorage.setItem('user', JSON.stringify(user));
        });
      },
    );
  };

  beforeEach(() => {
    loginViaApi();

    // Ensure cart has an item
    cy.visit('/');
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).first().within(() => {
      cy.contains('Add to Cart').click();
    });
  });

  it('places an order successfully', () => {
    cy.visit('/cart');
    cy.contains('Proceed to Checkout').click();
    cy.url().should('include', '/checkout');
    cy.contains('Place Order').click();
    cy.url().should('include', '/orders');
  });
});