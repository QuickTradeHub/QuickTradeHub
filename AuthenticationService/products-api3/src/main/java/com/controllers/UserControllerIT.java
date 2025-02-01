package com.controllers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private String adminToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User admin = new User(null, "admin@example.com", passwordEncoder.encode("admin123"), "Admin User", true, Role.ADMIN, null, null);
        userRepository.save(admin);
        adminToken = "Bearer " + jwtUtil.generateToken("admin@example.com");
    }

    @Test
    void testGetAllUsers_Success() throws Exception {
        mockMvc.perform(get("/auth/users")
                .header("Authorization", adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteUser_Success() throws Exception {
        User user = new User(null, "user@example.com", passwordEncoder.encode("password123"), "User Test", true, Role.USER, null, null);
        user = userRepository.save(user);

        mockMvc.perform(delete("/auth/user/" + user.getId())
                .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted successfully"));
    }
}
