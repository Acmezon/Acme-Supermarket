from maps.acme_database import today_customers, today_purchases
import main_heur
import main_exact

def run():
	t_purchases = today_purchases()
	t_customers = today_customers()

	if len(t_customers)>9:
		main_heur.run_acmesupermarket(t_purchases, t_customers)
	else:
		main_exact.run_acmesupermarket(t_purchases, t_customers)

		
if __name__=='__main__':
	run()