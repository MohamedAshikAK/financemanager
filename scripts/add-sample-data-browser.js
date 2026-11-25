/**
 * Add sample data to Pocket Finances app
 * Run this in the browser console (F12 → Console)
 */

(function addSampleData() {
  console.log('📝 Adding sample data to Pocket Finances app...\n');

  // Sample data for Finance
  const sampleFinanceEntries = [
    {
      title: 'Grocery Shopping',
      amount: 4500,
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString(),
      note: 'Weekly groceries from supermarket',
    },
    {
      title: 'Salary',
      amount: 85000,
      type: 'income',
      category: 'Salary',
      date: new Date().toISOString(),
      note: 'Monthly salary',
    },
    {
      title: 'Electricity Bill',
      amount: 2500,
      type: 'expense',
      category: 'Utilities',
      date: new Date().toISOString(),
      note: 'Monthly electricity bill',
    },
    {
      title: 'Freelance Payment',
      amount: 15000,
      type: 'income',
      category: 'Freelance',
      date: new Date().toISOString(),
      note: 'Web development project',
    },
    {
      title: 'Internet Bill',
      amount: 1200,
      type: 'expense',
      category: 'Utilities',
      date: new Date().toISOString(),
      note: 'Monthly internet connection',
    },
  ];

  // Sample data for Debts
  const sampleDebts = [
    {
      amount: 5000,
      type: 'owed-to-me',
      personId: 'contact-1',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Loan for emergency',
      isPaid: false,
    },
    {
      amount: 2000,
      type: 'owed-by-me',
      personId: 'contact-2',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Borrowed for dinner',
      isPaid: false,
    },
    {
      amount: 8000,
      type: 'owed-to-me',
      personId: 'contact-1',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Shared expenses',
      isPaid: false,
    },
  ];

  // Sample data for Credit Bills
  const sampleBills = [
    {
      cardName: 'HDFC Credit Card',
      currentAmount: 15000,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      isPaid: false,
    },
    {
      cardName: 'ICICI Amazon Pay',
      currentAmount: 8500,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      isPaid: false,
    },
    {
      cardName: 'SBI Credit Card',
      currentAmount: 25000,
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      isPaid: false,
    },
  ];

  // Sample data for Contacts
  const sampleContacts = [
    {
      name: 'John Doe',
      phone: '+91 98765 43210',
      email: 'john.doe@example.com',
    },
    {
      name: 'Jane Smith',
      phone: '+91 98765 43211',
      email: 'jane.smith@example.com',
    },
    {
      name: 'Mike Johnson',
      phone: '+91 98765 43212',
      email: 'mike.johnson@example.com',
    },
  ];

  try {
    // Add Finance entries
    const financeData = JSON.parse(localStorage.getItem('pocket-finances-finance') || '{"state":{"entries":[],"isHydrated":true}}');
    const financeEntries = financeData.state.entries || [];
    
    sampleFinanceEntries.forEach(entry => {
      const newEntry = {
        ...entry,
        id: crypto.randomUUID(),
        paidMonths: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      financeEntries.push(newEntry);
    });
    
    financeData.state.entries = financeEntries;
    localStorage.setItem('pocket-finances-finance', JSON.stringify(financeData));
    console.log('✅ Added 5 finance entries');

    // Add Debts
    const debtData = JSON.parse(localStorage.getItem('pocket-finances-debts') || '{"state":{"debts":[],"isHydrated":true}}');
    const debtEntries = debtData.state.debts || [];
    
    sampleDebts.forEach(debt => {
      const newDebt = {
        ...debt,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      debtEntries.push(newDebt);
    });
    
    debtData.state.debts = debtEntries;
    localStorage.setItem('pocket-finances-debts', JSON.stringify(debtData));
    console.log('✅ Added 3 debt records');

    // Add Credit Bills
    const billData = JSON.parse(localStorage.getItem('pocket-finances-bills') || '{"state":{"bills":[],"isHydrated":true}}');
    const billEntries = billData.state.bills || [];
    
    sampleBills.forEach(bill => {
      const newBill = {
        ...bill,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      billEntries.push(newBill);
    });
    
    billData.state.bills = billEntries;
    localStorage.setItem('pocket-finances-bills', JSON.stringify(billData));
    console.log('✅ Added 3 credit bills');

    // Add Contacts
    const contactData = JSON.parse(localStorage.getItem('pocket-finances-contacts') || '{"state":{"contacts":[],"isHydrated": true}}');
    const contactEntries = contactData.state.contacts || [];
    
    sampleContacts.forEach(contact => {
      const newContact = {
        ...contact,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      contactEntries.push(newContact);
    });
    
    contactData.state.contacts = contactEntries;
    localStorage.setItem('pocket-finances-contacts', JSON.stringify(contactData));
    console.log('✅ Added 3 contacts');

    console.log('\n🎉 Sample data added successfully!');
    console.log('📱 Refresh the page to see the sample data.');
    console.log('\n📊 Sample Data Summary:');
    console.log('   - Finance: 5 entries (3 expenses, 2 income)');
    console.log('   - Debts: 3 records');
    console.log('   - Credit Bills: 3 bills');
    console.log('   - Contacts: 3 contacts');
    
    // Auto-refresh after 2 seconds
    setTimeout(() => {
      console.log('🔄 Refreshing page...');
      location.reload();
    }, 2000);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
})();
