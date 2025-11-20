// Check if user is logged in
function checkAuth(requiredRole) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null")

  if (!user || user.role !== requiredRole) {
    window.location.href = "index.html"
  }
}

// Login form handler
const loginForm = document.getElementById("loginForm")
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const role = document.querySelector('input[name="role"]:checked').value

    // Simple login - accept any credentials
    const user = {
      email: email,
      role: role,
    }

    localStorage.setItem("currentUser", JSON.stringify(user))

    // Redirect based on role
    if (role === "teacher") {
      window.location.href = "teacher.html"
    } else {
      window.location.href = "student.html"
    }
  })
}

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Notice form handler
const noticeForm = document.getElementById("noticeForm")
if (noticeForm) {
  noticeForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const title = document.getElementById("noticeTitle").value
    const type = document.getElementById("noticeType").value
    const description = document.getElementById("noticeDescription").value
    const date = document.getElementById("noticeDate").value

    // Get existing notices
    const notices = JSON.parse(localStorage.getItem("notices") || "[]")

    // Create new notice
    const newNotice = {
      id: Date.now(),
      title: title,
      type: type,
      description: description,
      date: date,
      createdAt: new Date().toLocaleString(),
    }

    // Add to beginning of array
    notices.unshift(newNotice)

    // Save to localStorage
    localStorage.setItem("notices", JSON.stringify(notices))

    // Reset form
    noticeForm.reset()

    // Reload notices
    loadNotices()

    alert("Notice published successfully!")
  })
}

// Load and display notices
function loadNotices() {
  const noticesList = document.getElementById("noticesList")
  if (!noticesList) return

  const notices = JSON.parse(localStorage.getItem("notices") || "[]")
  const user = JSON.parse(localStorage.getItem("currentUser") || "null")

  if (notices.length === 0) {
    noticesList.innerHTML = '<p class="no-notices">No notices available</p>'
    return
  }

  noticesList.innerHTML = notices
    .map(
      (notice) => `
        <div class="notice-card">
            <span class="notice-badge ${notice.type}">${notice.type.toUpperCase()}</span>
            <h3>${notice.title}</h3>
            <p>${notice.description}</p>
            <p class="notice-date">Date: ${notice.date}</p>
            <p class="notice-date">Posted: ${notice.createdAt}</p>
            ${
              user && user.role === "teacher"
                ? `
                <button class="delete-btn" onclick="deleteNotice(${notice.id})">Delete</button>
            `
                : ""
            }
        </div>
    `,
    )
    .join("")
}

// Delete notice
function deleteNotice(id) {
  if (confirm("Are you sure you want to delete this notice?")) {
    let notices = JSON.parse(localStorage.getItem("notices") || "[]")
    notices = notices.filter((notice) => notice.id !== id)
    localStorage.setItem("notices", JSON.stringify(notices))
    loadNotices()
  }
}
