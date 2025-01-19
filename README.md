# Expense Tracker API

A comprehensive expense tracking system built with Node.js and MongoDB, designed to help users manage multiple accounts, track transactions, set budgets, and generate financial reports.

## Use Case

This application was developed for Eric, an employee at Code of Africa GmbH, to help him manage his personal finances across multiple accounts. Eric needed a solution to:
- Track transactions across different account types (bank, mobile money, cash)
- Monitor expenses by categories and subcategories
- Get notifications for budget overruns
- Generate custom time-period reports
- Visualize financial data

## Features

- **Multi-Account Management**
  - Support for bank accounts, mobile money, and cash accounts
  - Real-time balance tracking
  - Account-specific transaction history

- **Transaction Tracking**
  - Record income and expenses
  - Categorize transactions
  - Attach supporting documents
  - Track transaction dates and times
  - Add transaction notes

- **Categories & Subcategories**
  - Hierarchical category management
  - Custom category creation
  - Category-based reporting
  - Transaction categorization

- **Budgeting**
  - Set overall and category-specific budgets
  - Real-time budget tracking
  - Budget overspend notifications
  - Monthly/weekly budget resets

- **Reporting**
  - Custom date range reports
  - Category-wise expense analysis
  - Account-specific reports
  - Income vs Expense comparisons
  - Export reports (PDF/CSV)

- **Data Visualization**
  - Expense breakdown charts
  - Income trends
  - Category-wise spending graphs
  - Budget utilization displays

## Technical Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Structure

```
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── app.js
```

## Database Models

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  preferences: Object
}
```

### Account
```javascript
{
  name: String,
  type: Enum['bank', 'mobile_money', 'cash'],
  balance: Number,
  userId: ObjectId
}
```

### Category
```javascript
{
  name: String,
  description: String,
  parentId: ObjectId,
  userId: ObjectId
}
```

### Transaction
```javascript
{
  amount: Number,
  type: Enum['income', 'expense'],
  description: String,
  date: Date,
  accountId: ObjectId,
  categoryId: ObjectId,
  userId: ObjectId
}
```

### Budget
```javascript
{
  amount: Number,
  period: Enum['daily', 'weekly', 'monthly'],
  categoryId: ObjectId,
  userId: ObjectId
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts` - List all accounts
- `GET /api/accounts/:id` - Get account details
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Categories
- `POST /api/categories` - Create category
- `GET /api/categories` - List categories
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Transactions
- `POST /api/transactions` - Record transaction
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `POST /api/budgets` - Set budget
- `GET /api/budgets` - List budgets
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Reports
- `GET /api/reports/summary` - Get summary report
- `GET /api/reports/category` - Get category-wise report
- `GET /api/reports/custom` - Generate custom report

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Testing

Run the test suite:
```bash
# Unit tests
npm run test

# Test coverage
npm run test:coverage
```

## Security Features

- JWT Authentication
- Password Hashing
- Request Rate Limiting
- Input Validation
- XSS Protection
- CORS Configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For support, email support@example.com or open an issue in the repository.