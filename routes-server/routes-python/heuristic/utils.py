# -*- coding: utf-8 -*-

def raise_value_error(parameter, required, received):
    raise ValueError("{0} type not understood. {1} required. {1} received"
                        .format(parameter, required, received))