useEffect(() => {
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const authToken = getCookie("auth_token");
  console.log("auth", authToken);

  const storedUserDetails = localStorage.getItem("userDetails") || getCookie("userDetails");
  console.log("user (encoded)", storedUserDetails);

  if (authToken && storedUserDetails) {
    try {
      // Decode the userDetails string
      const decodedUserDetails = decodeURIComponent(storedUserDetails);
      console.log("user (decoded)", decodedUserDetails);

      // Parse the decoded string as JSON
      const parsedUserDetails = JSON.parse(decodedUserDetails) as UserDto;

      setToken(authToken);
      setIsAuthenticated(true);
      setUserDetails(parsedUserDetails);
    } catch (error) {
      console.error("Error parsing stored user details:", error);
      setToken(null);
      setIsAuthenticated(false);
      setUserDetails(null);
    }
  } else {
    setToken(null);
    setIsAuthenticated(false);
    setUserDetails(null);

    const publicRoutes = /\/(login|signup|verify-code|reset-password)/;
    if (!publicRoutes.test(window.location.pathname)) {
      router.push("/login");
    }
  }
}, [router]);
