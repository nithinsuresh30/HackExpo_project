# SpendWise — Student Expense Tracker

A modern, responsive, student-centric financial management web application built with **React**, **Vite**, **Tailwind CSS**, and **TypeScript**. 

SpendWise helps college students track income and daily expenses, monitor their monthly budget, visualize category-wise spending patterns, and stay within limits with automated **80% and 100% budget alerts**.

---

## 🚀 Key Features

1. **Authentication & User Management**:
   - Student Login and Registration with real-time form validation.
   - Demo account auto-fill helper (`student01` / `password123`) for quick testing.
   - Persistent user session handling via React Context.

2. **Interactive Financial Dashboard**:
   - Greeting header with dynamic student name & semester month selector.
   - 4 Metric Summary Cards: **Total Income** (₹25,000), **Total Spent** (₹14,500), **Monthly Budget** (₹20,000), and **Remaining Budget** (₹5,500).
   - Visual **Budget Progress Bar** with real-time percentage utilization (72.5%).
   - **80% Budget Warning Banner**: Alerts students when spending reaches 80% to curtail unnecessary spending.
   - **100%+ Budget Exceeded Alert**: High-priority alert when expenses surpass the monthly limit.
   - **Category-Wise Expense Summary**: Interactive Donut chart and progress bars breaking down spending across *Food*, *Travel*, *Education*, *Shopping*, *Bills*, *Entertainment*, *Health*, and *Other*.
   - **Recent Transactions Feed**: Fast view of latest income and expenses with category badges and one-click quick add.

3. **Transactions Management**:
   - Filter transactions by **Month**, **Type** (`ALL`, `INCOME`, `EXPENSE`), and **Category**.
   - Real-time search across note descriptions and amounts.
   - Full responsive layout: Structured tabular format on desktop/tablets, transformable into modern transaction cards on mobile.
   - **Delete Transaction**: Includes modal confirmation dialog (`ConfirmDialog`).
   - **Add Transaction**: Modal/form with strict validation (positive amounts, date, category selection).

4. **Dedicated Budget Planner**:
   - Set or update the target monthly spending ceiling.
   - Dynamic threshold indicators: *Normal* (0–79%), *Warning* (80–99%), *Exceeded* (100%+).
   - Actionable student financial advice and 50/30/20 college budgeting tips.

5. **Profile & Integration Settings**:
   - View student details, university affiliation, and system settings.
   - Easily toggle between offline LocalStorage mock engine and live Spring Boot REST API.
   - Reset demo data button to restore default scenario data.

---

## 📁 Project Structure

```
spendwise-student-tracker/
├── index.html                  # HTML entry point with font preloads & meta tags
├── metadata.json               # Applet configuration metadata
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundling setup with Tailwind CSS
├── README.md                   # Complete documentation & backend integration guide
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # Route declarations & main layout shell
    ├── index.css               # Global CSS & Tailwind typography rules
    ├── context/
    │   └── AuthContext.tsx     # User authentication state (currentUser, login, logout, register)
    ├── services/
    │   └── api.ts              # Centralized API service & LocalStorage mock fallback engine
    ├── utils/
    │   └── calculations.ts     # Currency formatting, percentages, category aggregations
    ├── components/
    │   ├── Navbar.tsx          # Responsive top bar with mobile menu trigger and quick add button
    │   ├── Sidebar.tsx         # Collapsible desktop & mobile drawer navigation
    │   ├── SummaryCard.tsx     # Stat metric card with icon and trend badge
    │   ├── BudgetProgress.tsx  # Dynamic budget meter with custom progress states
    │   ├── BudgetAlert.tsx     # 80% warning and 100% exceeded alert banner
    │   ├── CategorySummary.tsx # Interactive SVG Donut chart & category bar breakdown
    │   ├── TransactionForm.tsx # Reusable form / modal to record income & expenses
    │   ├── TransactionList.tsx # Desktop data table & mobile card view
    │   ├── TransactionCard.tsx # Mobile transaction card item
    │   ├── MonthSelector.tsx   # Month picker dropdown
    │   ├── ConfirmDialog.tsx   # Deletion confirmation modal
    │   ├── Loading.tsx         # Spinner and card skeletons
    │   ├── ErrorMessage.tsx    # Dismissible error banner
    │   └── SuccessMessage.tsx  # Dismissible success banner
    └── pages/
        ├── Login.tsx           # Student login screen with credentials validator
        ├── Register.tsx        # Registration screen with password confirmation
        ├── Dashboard.tsx       # Core financial analytics dashboard
        ├── Transactions.tsx    # Filterable transactions table & search
        ├── Budget.tsx          # Monthly budget configuration & progress
        └── Profile.tsx         # Account details and Spring Boot settings
```

---

## 🛠️ Installation & Running with VS Code

### 1. Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** or **bun** / **yarn**

### 2. Setup
Clone or open the project folder in **Visual Studio Code**:
```bash
# Open in VS Code
code .
```

### 3. Install Dependencies
Open the VS Code Terminal (`Ctrl + \`` or `Cmd + \``) and run:
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will start at:
```
http://localhost:3000
```

---

## ☕ Connecting to Java Spring Boot + Hibernate/JPA + MySQL Backend

The frontend API layer in `src/services/api.ts` is designed around the exact Spring Boot REST API specification.

### 1. API Base URL & Mode Toggle
In `src/services/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:8080/api';
export const USE_REAL_BACKEND = true; // Set to true when Spring Boot is running!
```

### 2. REST API Endpoints Contract

| Method | Endpoint | Description | Sample Request / Response Body |
|---|---|---|---|
| `POST` | `/api/register` | Register student | `{"fullName":"John Doe","username":"john12","email":"john@edu.com","password":"123"}` |
| `POST` | `/api/login` | User login | `{"username":"john12","password":"123"}` |
| `GET` | `/api/dashboard?userId=1&month=2026-10` | Dashboard overview | Returns `{income, spent, budget, remaining, percentUsed, categorySummary}` |
| `GET` | `/api/transactions?userId=1&month=2026-10` | List transactions | Returns array of `Transaction` objects |
| `POST` | `/api/transactions` | Add transaction | `{"userId":1,"type":"EXPENSE","amount":250,"category":"Food","date":"2026-10-06","note":"Lunch"}` |
| `DELETE`| `/api/transactions/{id}` | Delete transaction | Returns `{"success": true, "message": "Deleted"}` |
| `GET` | `/api/budget?userId=1&month=2026-10` | Get budget | Returns `{"userId":1,"month":"2026-10","amount":20000}` |
| `POST` | `/api/budget` | Set/Update budget | `{"userId":1,"month":"2026-10","amount":20000}` |

---

### 3. Spring Boot Backend Architecture Reference

#### `application.properties` (MySQL Database Setup)
```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/spendwise_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

#### CORS Configuration (`WebConfig.java`)
Enable cross-origin requests from the React frontend running on port 3000:
```java
package com.spendwise.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

#### Transaction Entity (`Transaction.java`)
```java
package com.spendwise.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // INCOME, EXPENSE

    private Double amount;
    private String category;
    private LocalDate date;
    private String note;

    // Getters and Setters
}
```

#### Transaction Controller (`TransactionController.java`)
```java
package com.spendwise.controller;

import com.spendwise.model.Transaction;
import com.spendwise.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping
    public List<Transaction> getTransactions(@RequestParam Long userId, @RequestParam(required = false) String month) {
        return transactionRepository.findByUserId(userId);
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionRepository.deleteById(id);
    }
}
```

---

## 🎨 Color Palette & Visual System

- **Primary Brand**: `#6C5CE7` (Modern Soft Purple)
- **Secondary Accent**: `#8E7CF8` (Lavender Glow)
- **Success / Income**: `#16A34A` / `#10B981` (Emerald Green)
- **Warning Threshold**: `#F59E0B` (Amber Orange, 80% usage alert)
- **Danger / Overbudget**: `#DC2626` (Crimson Rose, 100%+ alert)
- **Background**: `#F5F7FB` (Light Neutral Canvas)
- **Cards**: `#FFFFFF` with soft drop shadows and rounded corners (`rounded-2xl` & `rounded-3xl`)
