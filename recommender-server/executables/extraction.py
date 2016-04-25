# -*-coding:utf-8-*-

import numpy as np


def run(L, transactions, min_support, min_confidence):
    rules = []
    for sets in L:
        for set in sets:
            if len(set) > 1:
                for i in range(len(set)):
                    antecedent = np.concatenate([set[0:i], set[i+1: ]])
                    consequent = set[i]

                    supportXY = 0
                    transactionsX = []
                    for transaction in transactions:
                        if np.intersect1d(transaction, set).size == set.size:
                            supportXY += 1
                        if np.intersect1d(transaction, antecedent).size \
                           == antecedent.size:
                            transactionsX.append(transaction)

                    confidenceXY = 0
                    for transaction in transactionsX:
                        if np.intersect1d(transaction, set).size == set.size:
                            confidenceXY += 1

                    supportXY /= len(transactions)
                    confidenceXY /= len(transactionsX)
                    if supportXY >= min_support and confidenceXY >= min_confidence:
                        rules.append((list(antecedent), consequent))
    return rules


def run_enhanced(candidates_transactions, L, transactions_nr,
                 min_support, min_confidence, transactions):
    rules = []
    for sets in L:
        for set in sets:
            if len(set) > 1:
                if len(candidates_transactions[tuple(set)]) / transactions_nr \
                   > min_support:
                    for i in range(len(set)):
                        antecedent = np.concatenate([set[0:i], set[i+1: ]])
                        consequent = set[i]

                        if len(antecedent) == 1:
                            antecedent = antecedent.item(0)
                        else:
                            antecedent = tuple(antecedent)

                        transactionsX = np.array(
                            candidates_transactions[antecedent])
                        confidence = 0
                        for transaction in transactionsX:
                            if np.intersect1d(transactions[transaction],
                                              set).size == set.size:
                                confidence += 1
                        confidence /= len(transactionsX)

                        if type(antecedent) == tuple:
                            antecedent = list(antecedent)
                        else:
                            antecedent = [antecedent]

                        if confidence >= min_confidence:
                            rules.append((antecedent, consequent))
    return rules
