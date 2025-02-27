const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  // Validate form
  if (!formData.email) {
    setError(t.emailRequired);
    return;
  }
  if (!formData.password) {
    setError(t.passwordRequired);
    return;
  }
  
  setIsLoading(true);
  
  try {
    // In production environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || t.invalidCredentials);
    }
    
    // Save user data and token
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err) {
    setError(err.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};