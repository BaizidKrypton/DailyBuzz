import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How do I create a new alarm?',
    answer: 'Navigate to the Alarms section and click the "Add Alarm" button. Set your time, choose a challenge type, and save.'
  },
  {
    question: 'What are alarm challenges?',
    answer: 'Alarm challenges are puzzles you must solve to dismiss your alarm. Choose from Math, Logic, or Memory challenges to make sure you\'re fully awake.'
  },
  {
    question: 'How do health reminders work?',
    answer: 'Health reminders include Water intake and Medicine tracking. Create reminders with specific times and get notifications every 5 minutes until you mark them complete.'
  },
  {
    question: 'Can I track my expenses?',
    answer: 'Yes! Use the Finance section to add income and expenses, categorize them, and view your monthly balance.'
  },
  {
    question: 'How does the Buzz AI assistant help?',
    answer: 'Buzz is your AI companion that can help manage tasks, provide insights, and answer questions about your productivity.'
  }
];

export default function Help() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Help & FAQ
          </h1>
          <p className="text-muted-foreground mt-2">Find answers to common questions</p>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <HelpCircle className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-6 border-2 shadow-xl bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Visit our Feedback section to send us a message.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
