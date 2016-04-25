import argparse
import preprocessing.acmesupermarket as acmesupermarket
import apriori
import apriori_enhanced

def run(type, min_support=0.05, min_confidence=0.5):
    if type == 'basic':
        acmesupermarket.load_transactions(
            'files/transactions_acme-supermarket.npy')
        rules = apriori.run(
            min_support, min_confidence,
            'files/transactions_acme-supermarket.npy')
        acmesupermarket.save_rules(rules)
    else:
        acmesupermarket.load_transactions(
           'files/transactions_acme-supermarket.npy')
        rules = apriori_enhanced.run(
            min_support, min_confidence,
            'files/transactions_acme-supermarket.npy')
        acmesupermarket.save_rules(rules)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()

    ap.add_argument("-t", "--type", required=True,
                    choices=['basic', 'enhanced'],
                    help="Operation to run: basic / enhanced")

    ap.add_argument("-s", "--minsupport", required=True, help="Min. support")

    ap.add_argument(
        "-c", "--minconfidence", required=True, help="Min. confidence")

    args = vars(ap.parse_args())
    run(args['type'], float(
        args['minsupport']), float(args['minconfidence']))
