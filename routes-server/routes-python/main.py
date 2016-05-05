from maps.acme_database import today_customers, today_purchases
import main_heur
import main_exact

def run():
	today_purchases = today_purchases()
	today_customers = today_customers()

	if len(today_customers)>9:
		main_heur.run_acmesupermarket(today_purchases, today_customers)
	else:
		main_exact.run_acmesupermarket(today_purchases, today_customers)

		
if __name__=='__main__':
	run()