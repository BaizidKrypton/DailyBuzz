import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { financeService } from '@/services/financeService';
import { useToast } from '@/hooks/use-toast';
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string | null;
  transaction_date: string;
};

export default function FinanceList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [transactionsData, monthlyStats] = await Promise.all([
        financeService.getTransactions(user!.id),
        financeService.getMonthlyStats(user!.id)
      ]);
      setTransactions(transactionsData as Transaction[]);
      setStats(monthlyStats);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load finance data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await financeService.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Transaction deleted'
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Finance Tracker
            </h1>
            <p className="text-muted-foreground mt-2">Manage your income and expenses</p>
          </div>
          <Button onClick={() => navigate('/finance/create')} size="lg" className="shadow-lg bg-gradient-to-r from-accent to-accent/80">
            <Plus className="mr-2 h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-5 w-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">৳{stats.income.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/20 bg-gradient-to-br from-card to-destructive/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-5 w-5 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">৳{stats.expenses.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5 hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Wallet className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                ৳{stats.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No transactions yet. Add your first one!</p>
                ) : (
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 border-2 rounded-xl bg-gradient-to-r from-card to-primary/5 hover:shadow-md transition-all"
                    >
                      <div className={`p-3 rounded-full ${transaction.type === 'INCOME' ? 'bg-secondary/20' : 'bg-destructive/20'}`}>
                        {transaction.type === 'INCOME' ? (
                          <TrendingUp className="h-5 w-5 text-secondary" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{transaction.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{transaction.category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`text-xl font-bold ${transaction.type === 'INCOME' ? 'text-secondary' : 'text-destructive'}`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}৳{Number(transaction.amount).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/finance/edit/${transaction.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
