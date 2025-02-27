const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  // Validate form
  if (!formData.name) {
    setError(t.nameRequired);
    return;
  }
  if (!formData.email) {
    setError(t.emailRequired);
    return;
  }
  if (!validateEmail(formData.email)) {
    setError(t.emailInvalid);
    return;
  }
  if (!formData.phone) {
    setError(t.phoneRequired);
    return;
  }
  if (!formData.password) {
    setError(t.passwordRequired);
    return;
  }
  if (formData.password.length < 8) {
    setError(t.passwordMinLength);
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    setError(t.passwordNotMatch);
    return;
  }
  if (!acceptTerms) {
    setError(t.termsRequired);
    return;
  }
  
  setIsLoading(true);
  
  try {
    // Prepare data for API
    const userData = {
      username: formData.email.split('@')[0], // Create username from email
      email: formData.email,
      password: formData.password,
      full_name: formData.name,
      phone_number: formData.phone,
      company: formData.company
    };
    
    // Send to API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    // Show success message
    setError('');
    alert(t.registrationSuccess);
    
    // Redirect to login page
    router.push('/login');
  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message || 'Registration failed');
  } finally {
    setIsLoading(false);
  }
};