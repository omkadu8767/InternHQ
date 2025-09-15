<template>
  <v-app>
    <AppNavbar />
    <v-main class="pa-0">
      <!-- Hero Section -->
      <v-container
        fluid
        class="hero-section primary"
        style="
          min-height: 100vh;
          margin-top: -64px;
          padding-top: 64px;
          border-top: 3px solid white;
        "
      >
        <v-container>
          <v-row align="center" justify="center" style="min-height: 80vh">
            <v-col cols="12" md="6" class="text-center text-md-left">
              <h1 class="display-1 font-weight-bold white--text mb-4">
                Welcome to <span class="cyan--text text--lighten-2">InternHQ</span>
              </h1>
              <p class="headline white--text mb-6">
                Your one-stop platform for managing internships, tracking progress, and
                connecting interns with mentors.
              </p>
              <v-btn large color="cyan lighten-2" dark class="mr-4 mb-2" to="/signup">
                Get Started
              </v-btn>
              <v-btn large outlined color="white" class="mb-2" to="/login"> Login </v-btn>
            </v-col>
            <v-col cols="12" md="6" class="text-center">
              <v-img src="@/assets/logo2.png" max-width="300" class="mx-auto"></v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Features Section -->
      <v-container class="py-12">
        <v-row>
          <v-col cols="12" class="text-center mb-8">
            <h2 class="display-1 font-weight-bold primary--text mb-4">
              Why Choose InternHQ?
            </h2>
            <p class="subtitle-1 grey--text text--darken-1">
              Discover the features that make us the best internship management platform
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4" v-for="feature in features" :key="feature.title">
            <v-card class="text-center pa-6" elevation="3" height="100%">
              <v-icon size="64" :color="feature.color" class="mb-4">
                {{ feature.icon }}
              </v-icon>
              <h3 class="headline font-weight-bold mb-3">{{ feature.title }}</h3>
              <p class="body-1 grey--text text--darken-1">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Statistics Section -->
      <v-container fluid class="grey lighten-4 py-12">
        <v-container>
          <v-row>
            <v-col
              cols="6"
              md="3"
              v-for="stat in statistics"
              :key="stat.title"
              class="text-center"
            >
              <h2 class="display-2 font-weight-bold primary--text">{{ stat.number }}</h2>
              <p class="headline grey--text text--darken-1">{{ stat.title }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- About Section -->
      <v-container class="py-12">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h2 class="display-1 font-weight-bold primary--text mb-4">About InternHQ</h2>
            <p class="body-1 mb-4">
              At InternHQ, we believe in nurturing talent and providing real-world
              experience. Our platform offers comprehensive dashboards for both admins and
              interns, interactive leaderboards, efficient task management, and seamless
              communication tools.
            </p>
            <p class="body-1 mb-6">
              We empower organizations to streamline their internship programs while
              helping interns grow professionally through structured learning and
              mentorship opportunities.
            </p>
            <v-btn color="primary" large to="/signup">Join Us Today</v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-img src="@/assets/InternDash.png" class="rounded-lg"></v-img>
          </v-col>
        </v-row>
      </v-container>

      <!-- Testimonials Section -->
      <v-container fluid class="primary py-12">
        <v-container>
          <v-row>
            <v-col cols="12" class="text-center mb-8">
              <h2 class="display-1 font-weight-bold white--text mb-4">
                What Our Users Say
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
              v-for="testimonial in testimonials"
              :key="testimonial.name"
            >
              <v-card class="pa-6" elevation="3">
                <v-rating
                  :value="testimonial.rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="20"
                  class="mb-3"
                ></v-rating>
                <p class="body-1 mb-4">"{{ testimonial.comment }}"</p>
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="40" class="mr-3">
                    <span class="white--text">{{ testimonial.name.charAt(0) }}</span>
                  </v-avatar>
                  <div>
                    <p class="font-weight-bold mb-0">{{ testimonial.name }}</p>
                    <p class="caption grey--text mb-0">{{ testimonial.role }}</p>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Contact Section -->
      <v-container class="py-12">
        <v-row>
          <v-col cols="12" md="6">
            <h2 class="display-1 font-weight-bold primary--text mb-4">Get In Touch</h2>
            <v-row>
              <v-col cols="12" v-for="contact in contactInfo" :key="contact.type">
                <div class="d-flex align-center mb-3">
                  <v-icon color="primary" class="mr-4" size="24">{{
                    contact.icon
                  }}</v-icon>
                  <div>
                    <p class="font-weight-bold mb-1">{{ contact.type }}</p>
                    <p class="body-2 grey--text text--darken-1 mb-0">
                      {{ contact.value }}
                    </p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-6" elevation="3">
              <h3 class="headline font-weight-bold mb-4">Send us a message</h3>
              <v-form ref="contactForm" v-model="formValid" @submit.prevent="sendEmail">
                <v-text-field
                  v-model="form.name"
                  label="Full Name"
                  outlined
                  dense
                  class="mb-3"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  outlined
                  dense
                  type="email"
                  class="mb-3"
                  :rules="[rules.required, rules.email]"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="form.message"
                  label="Message"
                  outlined
                  dense
                  rows="4"
                  class="mb-3"
                  :rules="[rules.required]"
                  required
                ></v-textarea>
                <v-btn
                  color="primary"
                  block
                  large
                  type="submit"
                  :loading="sending"
                  :disabled="!formValid"
                >
                  {{ sending ? "Sending..." : "Send Message" }}
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Newsletter Section -->
      <v-container fluid class="grey lighten-4 py-12">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h2 class="display-1 font-weight-bold primary--text mb-4">Stay Updated</h2>
              <p class="subtitle-1 grey--text text--darken-1 mb-6">
                Subscribe to our newsletter for the latest updates and internship
                opportunities
              </p>
              <v-row justify="center">
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Enter your email"
                    outlined
                    dense
                    append-icon="mdi-send"
                    @click:append="subscribe"
                    class="mb-0"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>

    <!-- Enhanced Footer -->
    <v-footer color="primary" dark class="pa-6">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="mb-4">
            <div class="d-flex align-center mb-3">
              <img src="@/assets/logo2.png" height="32" class="mr-2" />
              <span class="headline font-weight-bold">InternHQ</span>
            </div>
            <p class="body-2">
              Empowering the next generation of professionals through innovative
              internship management solutions.
            </p>
          </v-col>
          <v-col cols="12" md="2" class="mb-4">
            <h4 class="font-weight-bold mb-3">Quick Links</h4>
            <v-list dense dark color="transparent">
              <v-list-item to="/" link>
                <v-list-item-content>
                  <v-list-item-title>Home</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/login" link>
                <v-list-item-content>
                  <v-list-item-title>Login</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item to="/signup" link>
                <v-list-item-content>
                  <v-list-item-title>Sign Up</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="3" class="mb-4">
            <h4 class="font-weight-bold mb-3">Contact Info</h4>
            <p class="body-2 mb-1">📧 support@internhq.com</p>
            <p class="body-2 mb-1">📞 +91 234 567 8901</p>
            <p class="body-2">📍 123 Internship Lane, Tech City</p>
          </v-col>
          <v-col cols="12" md="3" class="mb-4">
            <h4 class="font-weight-bold mb-3">Follow Us</h4>
            <div class="d-flex">
              <v-btn
                icon
                color="white"
                class="mr-2"
                href="https://www.linkedin.com/in/om-kadu-53305425a/"
                target="_blank"
              >
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn
                icon
                color="white"
                class="mr-2"
                href="https://x.com/OmKadu79824376"
                target="_blank"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn
                icon
                color="white"
                class="mr-2"
                href="https://www.linkedin.com/in/om-kadu-53305425a/"
                target="_blank"
              >
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
              <v-btn
                icon
                color="white"
                href="https://github.com/omkadu8767"
                target="_blank"
              >
                <v-icon>mdi-github</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-row>
          <v-col cols="12" class="text-center">
            <p class="body-2 mb-0">
              © {{ new Date().getFullYear() }} InternHQ. All rights reserved. | Privacy
              Policy | Terms of Service
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

    <!-- Made with love section -->
    <v-container fluid class="primary py-3">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <a
              href="https://www.linkedin.com/in/om-kadu-53305425a/"
              target="_blank"
              style="text-decoration: none"
            >
              <span class="gradient-text font-weight-bold">
                Made with love
                <span
                  style="color: red !important; -webkit-text-fill-color: red !important"
                  >❤️</span
                >
                by OK
              </span>
            </a>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-app>
</template>

<script>
import AppNavbar from "@/components/AppNavbar.vue";
import emailjs from "@emailjs/browser";

export default {
  components: { AppNavbar },
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
      },
      formValid: false,
      sending: false,

      // Validation rules
      rules: {
        required: (value) => !!value || "This field is required",
        email: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "Please enter a valid email address";
        },
      },

      // EmailJS configuration
      emailjsConfig: {
        serviceId: process.env.VUE_APP_EMAILJS_SERVICE_ID,
        templateId: process.env.VUE_APP_EMAILJS_TEMPLATE_ID,
        publicKey: process.env.VUE_APP_EMAILJS_PUBLIC_KEY,
      },
      features: [
        {
          title: "Dashboard Management",
          description:
            "Comprehensive dashboards for both admins and interns with real-time analytics.",
          icon: "mdi-view-dashboard",
          color: "primary",
        },
        {
          title: "Task Tracking",
          description:
            "Efficient task management system with progress tracking and deadlines.",
          icon: "mdi-clipboard-check",
          color: "success",
        },
        {
          title: "Leaderboards",
          description:
            "Gamified learning with interactive leaderboards to motivate interns.",
          icon: "mdi-trophy",
          color: "warning",
        },
      ],
      statistics: [
        { number: "500+", title: "Active Interns" },
        { number: "50+", title: "Companies" },
        { number: "1000+", title: "Tasks Completed" },
        { number: "95%", title: "Success Rate" },
      ],
      testimonials: [
        {
          name: "Sachin Nerkar",
          role: "HR Manager, TechCorp",
          comment:
            "InternHQ has revolutionized how we manage our internship program. The dashboard is intuitive and the tracking features are excellent.",
          rating: 5,
        },
        {
          name: "Om Kadu",
          role: "Software Intern",
          comment:
            "The platform made my internship experience so much better. I could track my progress and connect with mentors easily.",
          rating: 4.5,
        },
        {
          name: "Prachi Sharma",
          role: "Program Director",
          comment:
            "Outstanding platform! The leaderboard feature really motivates our interns to perform better.",
          rating: 5,
        },
      ],
      contactInfo: [
        { type: "Email", value: "support@internhq.com", icon: "mdi-email" },
        { type: "Phone", value: "+91 234 567 8901", icon: "mdi-phone" },
        {
          type: "Address",
          value: "123 Internship Lane, Tech City, India",
          icon: "mdi-map-marker",
        },
        {
          type: "Office Hours",
          value: "Monday - Friday, 9 AM - 6 PM",
          icon: "mdi-clock",
        },
      ],
    };
  },
  mounted() {
    // Debug environment variables
    console.log("Environment variables debug:");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("EmailJS Config with fallbacks:", this.emailjsConfig);
  },
  methods: {
    async sendEmail() {
      if (!this.formValid) return;

      // Check if EmailJS credentials are configured
      if (
        !this.emailjsConfig.serviceId ||
        !this.emailjsConfig.templateId ||
        !this.emailjsConfig.publicKey
      ) {
        console.error("EmailJS credentials not configured");
        if (this.$toast) {
          this.$toast.error(
            "Email service not configured. Please contact administrator."
          );
        } else {
          alert("Email service not configured. Please contact administrator.");
        }
        return;
      }

      this.sending = true;

      try {
        // Initialize EmailJS
        emailjs.init(this.emailjsConfig.publicKey);

        // Prepare template parameters
        const templateParams = {
          from_name: this.form.name,
          from_email: this.form.email,
          message: this.form.message,
          to_name: "InternHQ Team",
          reply_to: this.form.email,
        };

        // Send email
        const response = await emailjs.send(
          this.emailjsConfig.serviceId,
          this.emailjsConfig.templateId,
          templateParams
        );

        console.log("Email sent successfully:", response);

        // Show success message
        if (this.$toast) {
          this.$toast.success("Message sent successfully! We'll get back to you soon.");
        } else {
          alert("Message sent successfully! We'll get back to you soon.");
        }

        // Reset form
        this.resetForm();
      } catch (error) {
        console.error("Failed to send email:", error);

        // Show error message
        if (this.$toast) {
          this.$toast.error("Failed to send message. Please try again later.");
        } else {
          alert("Failed to send message. Please try again later.");
        }
      } finally {
        this.sending = false;
      }
    },

    resetForm() {
      this.form = {
        name: "",
        email: "",
        message: "",
      };
      this.$refs.contactForm.resetValidation();
    },
    subscribe() {
      // Add newsletter subscription logic here
      this.$toast.success("Thank you for subscribing!");
    },
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  box-shadow: inset 0 3px 0 0 white;
}

.v-main {
  padding-top: 0 !important;
}

.v-card {
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
}
.gradient-text {
  background: linear-gradient(45deg, #ffffff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 14px;
  font-weight: bold;
}
</style>
