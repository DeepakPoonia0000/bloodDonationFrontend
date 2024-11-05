import React, { useEffect } from 'react'

const PendingUser = () => {
    useEffect(() => {
        fetchPendingUsers();
      }, []);

      const fetchPendingUsers = async () => {
        try {
          const result = await axios.get(`${BaseUrl}/pending-users`, { headers: { Authorization: token } });
          setPendingUsers(result.data.pendingUsers);

          console.log(result.data)
        } catch (error) {
          console.log("error is in fetchPendingUsers")
          console.error('Request failed:', error);
        }
    
      };

  return (
    <div>
      
    </div>
  )
}

export default PendingUser
